/*
    Automatic JavaScript Invariants is a plugin for Crawljax that can be
    used to derive JavaScript invariants automatically and use them for
    regressions testing.
    Copyright (C) 2010  crawljax.com

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

 */
package com.metis.jsmodify;

import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

//import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.crawljax.util.Helper;
import com.fasterxml.jackson.datatype.guava.GuavaModule;
import com.metis.core.episode.Episode;
import com.metis.core.episode.EpisodeSource;
import com.metis.core.trace.DOMEventTrace;
import com.metis.core.trace.FunctionEnter;
import com.metis.core.trace.FunctionExit;
import com.metis.core.trace.TimingTrace;
import com.metis.core.trace.Trace;
import com.metis.core.trace.TraceObject;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Iterables;
import com.google.common.collect.Multimap;
import com.google.common.collect.TreeMultimap;

/**
 * Reads an instrumentation array from the webbrowser and
 * saves the contents in a JSON trace file.
 * 
 * @author Frank Groeneveld
 * @version $Id: JSExecutionTracer.java 6162 2009-12-16 13:56:21Z frank $
 */
public class JSExecutionTracer {

	private static final int ONE_SEC = 1000;

	private static String outputFolder;
	private static String traceFilename;

	private static JSONArray points = new JSONArray();

	private static final Logger LOGGER = Logger
			.getLogger(JSExecutionTracer.class.getName());

	public static final String FUNCTIONTRACEDIRECTORY = "functiontrace/";

	private static PrintStream output;

	private static ArrayList<TraceObject> traceObjects;

	private Trace trace;
	private ArrayList<TraceObject> sortedTraceList;
	private ArrayList<Episode> episodeList;

	/**
	 * @param filename
	 * 
	 */
	public JSExecutionTracer(String filename) {
		traceFilename = filename;
		traceObjects = new ArrayList<TraceObject>();
		sortedTraceList = new ArrayList<TraceObject>();
		episodeList = new ArrayList<Episode>();
	}

	/**
	 * Initialize the plugin and create folders if needed.
	 * 
	 * @param browser
	 *            The browser.
	 */
	public void preCrawling() {
		try {
			Helper.directoryCheck(getOutputFolder());
			output = new PrintStream(getOutputFolder() + getFilename());

			// Add opening bracket around whole trace
			PrintStream oldOut = System.out;
			System.setOut(output);
			System.out.println("{");
			System.setOut(oldOut);

		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Retrieves the JavaScript instrumentation array from the webbrowser and
	 * writes its contents in Daikon format to a file.
	 * 
	 * @param session
	 *            The crawling session.
	 * @param candidateElements
	 *            The candidate clickable elements.
	 */

	public void preStateCrawling() {

		String filename = getOutputFolder() + FUNCTIONTRACEDIRECTORY
				+ "jstrace-";

		DateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		Date date = new Date();
		filename += dateFormat.format(date) + ".dtrace";

		try {

			LOGGER.info("Reading execution trace");

			LOGGER.info("Parsing JavaScript execution trace");

			// session.getBrowser().executeJavaScript("sendReally();");
			Thread.sleep(ONE_SEC);

			LOGGER.info("Saved execution trace as " + filename);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Get a list with all trace files in the executiontracedirectory.
	 * 
	 * @return The list.
	 */
	public List<String> allTraceFiles() {
		ArrayList<String> result = new ArrayList<String>();

		/* find all trace files in the trace directory */
		File dir = new File(getOutputFolder() + FUNCTIONTRACEDIRECTORY);

		String[] files = dir.list();
		if (files == null) {
			return result;
		}
		for (String file : files) {
			if (file.endsWith(".dtrace")) {
				result.add(getOutputFolder() + FUNCTIONTRACEDIRECTORY + file);
			}
		}
		return result;
	}

	public void postCrawling() {
		try {
			// Add closing bracket
			PrintStream oldOut = System.out;
			System.setOut(output);
			System.out.println(" ");
			System.out.println("}");
			System.setOut(oldOut);

			/* close the output file */
			output.close();

			extraxtTraceObjects();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * This method parses the JSON file containing the trace objects and
	 * extracts the objects
	 */
	private void extraxtTraceObjects() {
		try {
			ObjectMapper mapper = new ObjectMapper();
			// Register the module that serializes the Guava Multimap
			mapper.registerModule(new GuavaModule());

			Multimap<String, TraceObject> traceMap = mapper
					.<Multimap<String, TraceObject>> readValue(
							new File("metis-output/ftrace/function.trace"),
							new TypeReference<TreeMultimap<String, TraceObject>>() {
							});

			Collection<TraceObject> timingTraces = traceMap.get("TimingTrace");
			Collection<TraceObject> domEventTraces = traceMap
					.get("DOMEventTrace");
			Collection<TraceObject> XHRTraces = traceMap.get("XHRTrace");
			Collection<TraceObject> functionTraces = traceMap
					.get("FunctionTrace");

			trace = new Trace(domEventTraces, functionTraces, timingTraces, XHRTraces);
			sortedTraceList = sortTraceObjects();
			episodeList = buildEpisodes();

			System.out.println("# of trace objects: " + sortedTraceList.size());
			System.out.println("# of episodes: " + episodeList.size());

			for (Episode e:episodeList) {
				// Create pic files for each episode's sequence diagram
				designSequenceDiagram(e);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private void designSequenceDiagram(Episode e) {
		// Given an episode (source, trace included), a pic file will be created
		// in metis-output/ftrace/sequence_diagrams

		ArrayList<String> functionHeirarchy = new ArrayList<String>();

		try {
			Helper.directoryCheck(getOutputFolder()+"sequence_diagrams/");
			output = new PrintStream(getOutputFolder()+"sequence_diagrams/"+e.getSource().getCounter()+".pic");	

			beginPicFile(output);

			// Define all the objects for the sequence diagram
			ArrayList<TraceObject> functionTraceObjects = e.getTrace().getTrace();
			ArrayList<String> componentNames = new ArrayList<String>();
			PrintStream oldOut = System.out;
			System.setOut(output);

			System.out.println("# Define the objects");
			System.out.println("pobject(EPISODESOURCE,\""+e.getSource().getClass().toString()+"\");");
			push(functionHeirarchy, "EPISODESOURCE");
			for (TraceObject to: functionTraceObjects) {
				if (to.getClass().toString().contains("FunctionEnter")) {
					// Create components in the sequence diagram for developer-defined functions
					FunctionEnter feto = (FunctionEnter) to;
					if (!componentNames.contains(feto.getTargetFunction().toUpperCase())) {
						// Component for this function has not already been created
						System.out.println("object("+feto.getTargetFunction().toUpperCase()+",\":"+feto.getTargetFunction()+"\");");
						componentNames.add(feto.getTargetFunction().toUpperCase());
					}
				}
			}
			System.out.println("step();");
			System.out.println("");

			System.out.println(" # Message sequences");
			for (TraceObject to: functionTraceObjects) {
				if (to.getClass().toString().contains("FunctionEnter")) {
					// Message entering next function
					FunctionEnter feto = (FunctionEnter) to;

					push(functionHeirarchy, feto.getTargetFunction());

					// Create message from previously executing function
					System.out.println("message("+functionHeirarchy.get(functionHeirarchy.size()-2)+","
							+functionHeirarchy.get(functionHeirarchy.size()-1)+",\"arguments\");");

					// Mark new function as executing
					System.out.println("active("+functionHeirarchy.get(functionHeirarchy.size()-1)+");");

				} else if (to.getClass().toString().contains("FunctionExit")) {
					// Return to previous function

					System.out.println("rmessage("+functionHeirarchy.get(functionHeirarchy.size()-1)
							+","+functionHeirarchy.get(functionHeirarchy.size()-2)+");");
					System.out.println("inactive("+functionHeirarchy.get(functionHeirarchy.size()-1)+");");
					pop(functionHeirarchy);

				} else if (to.getClass().toString().contains("ReturnStatement")) {
					System.out.println("rmessage("+functionHeirarchy.get(functionHeirarchy.size()-1)
							+","+functionHeirarchy.get(functionHeirarchy.size()-2)+");");
					System.out.println("inactive("+functionHeirarchy.get(functionHeirarchy.size()-1)+");");
					pop(functionHeirarchy);
				}
			}

			System.setOut(oldOut);
			endPicFile(output, componentNames);
		} catch (IOException e1) {
			System.out.println("Error creating pic file fore episode.");
		}
	}

	private void beginPicFile(PrintStream output2) {
		System.setOut(output2);
		System.out.println(".PS");
		System.out.println("copy \"sequence.pic\";");
		System.out.println("");
		System.setOut(System.out);			
	}

	private void endPicFile(PrintStream output2, ArrayList<String> compNames) {
		System.setOut(output2);
		System.out.println("");
		System.out.println("# Complete the lifelines");
		System.out.println("step();");

		for (String cName: compNames) {
			System.out.println("complete("+cName+");");
		}

		System.out.println(".PE");
		System.setOut(System.out);	
	}

	private String pop(ArrayList<String> fh) {
		// Removes the last function called and returns the name
		// FILO
		return fh.remove(fh.size()-1);
	}

	private void push(ArrayList<String> fh, String functionName) {
		fh.add(functionName.toUpperCase());
	}

	/**
	 * This method sorts all four groups of trace objects into one ordered list of trace objects
	 */
	private ArrayList<TraceObject> sortTraceObjects() {
		ArrayList<TraceObject> sortedTrace = new ArrayList<TraceObject>();

		ArrayList<Collection<TraceObject>> allCollections = new ArrayList<Collection<TraceObject>>();
		allCollections.add(trace.getDomEventTraces());
		allCollections.add(trace.getFunctionTraces());
		allCollections.add(trace.getTimingTraces());
		allCollections.add(trace.getXhrTraces());

		ArrayList<Integer> currentIndexInCollection = new ArrayList<Integer>();
		for (int i = 0; i < 4; i ++)
			currentIndexInCollection.add(0);

		while (true) {
			int currentMinArray = 0;

			for (int i = 0; i < allCollections.size(); i ++) {
				TraceObject traceObj = Iterables.get(allCollections.get(i), currentIndexInCollection.get(i));
				TraceObject currObj = Iterables.get(allCollections.get(currentMinArray), currentIndexInCollection.get(currentMinArray));
				if (traceObj.getCounter() < currObj.getCounter())
					currentMinArray = i;
			}

			sortedTrace.add(Iterables.get(allCollections.get(currentMinArray), currentIndexInCollection.get(currentMinArray)));

			currentIndexInCollection.set(currentMinArray, currentIndexInCollection.get(currentMinArray) + 1);
			if (currentIndexInCollection.get(currentMinArray) >= allCollections.get(currentMinArray).size()) {
				allCollections.remove(currentMinArray);
				currentIndexInCollection.remove(currentMinArray);
				if (allCollections.size() == 0)
					break;
			}
		}

		return sortedTrace;
	}

	private ArrayList<Episode> buildEpisodes() {
		ArrayList<Episode> episodes = new ArrayList<Episode>();
		int i, j;

		for (i = 0; i<sortedTraceList.size(); i++) {
			// Iterate through all TraceObjects and identify episodes
			TraceObject currentTraceObj = sortedTraceList.get(i);

			if (currentTraceObj.isEpisodeSource()) {
				// If the TraceObject is the beginning of an episode
				// i.e. DOMEvent, TimingEvent, or XHRRequest, create an episode
				Episode episode = new Episode(currentTraceObj);

				for (j = i+1; j<sortedTraceList.size(); j++ ) {
					// Go through the succeeding TraceObjects looking for the
					// end of the episode (as indicated by another episode starter
					// (DOMEvent, TimingEvent, etc.)

					currentTraceObj = sortedTraceList.get(j);

					if (!(currentTraceObj.isEpisodeSource())) {
						// If the succeeding TraceObject is not the beginning of
						// another episode, add it to the current episode
						episode.addToTrace(currentTraceObj);
					} else {
						// End of current episode, break out of inner-loop
						break;
					}
				}
				// Add the newly created episode to the list of episodes
				episodes.add(episode);
				// Update i to the end of the newly created episode
				i=j-1;
			}
		}
		return episodes;
	}
	/**
	 * @return Name of the file.
	 */
	public static String getFilename() {
		return traceFilename;
	}

	public static String getOutputFolder() {
		return Helper.addFolderSlashIfNeeded(outputFolder);
	}

	public void setOutputFolder(String absolutePath) {
		outputFolder = absolutePath;
	}

	/**
	 * Dirty way to save program points from the proxy request threads. TODO:
	 * Frank, find cleaner way.
	 * 
	 * @param string
	 *            The JSON-text to save.
	 */
	public static void addPoint(String string) {
		JSONArray buffer = null;
		JSONObject targetAttributes = null;
		JSONObject targetElement = null;
		String JSONLabel = new String();

		try {
			/* save the current System.out for later usage */
			PrintStream oldOut = System.out;
			/* redirect it to the file */
			System.setOut(output);

			buffer = new JSONArray(string);
			for (int i = 0; i < buffer.length(); i++) {

				if (points.length() > 0) {
					// Add comma after previous trace object
					System.out.println(",");
				}

				points.put(buffer.getJSONObject(i));

				if (buffer.getJSONObject(i).has("args") && ((String) buffer.getJSONObject(i).get("messageType")).contains("FUNCTION_ENTER")) {
					try {
						JSONObject args = (JSONObject) buffer.getJSONObject(i).get("args");
						String newValue = args.toString();				
						buffer.getJSONObject(i).remove("args");
						buffer.getJSONObject(i).put("args", newValue);
					} catch (JSONException jse) {
						// argument is not a JSON object
						continue;
					}
				}
				if (buffer.getJSONObject(i).has("targetElement")) {
					JSONArray extractedArray = new JSONArray(buffer
							.getJSONObject(i).get("targetElement").toString());
					try {
						targetAttributes = extractedArray.getJSONObject(1);
						String targetType = extractedArray.get(0).toString();

						targetElement = new JSONObject("{\"elementType\":\""
								+ targetType + "\",\"attributes\":"
								+ targetAttributes.toString() + "}");

					} catch (Exception e) {
						// targetElement is not usual DOM element
						// E.g. DOMContentLoaded
						if (buffer.getJSONObject(i).has("eventType")
								&& buffer.getJSONObject(i).get("eventType")
								.toString().contains("ContentLoaded")) {
							targetElement = new JSONObject(
									"{\"elementType\":\"DOCUMENT\",\"attributes\":\"-\"}");
						} else {
							targetElement = new JSONObject(
									"{\"elementType\":\"UNKNOWN\",\"attributes\":\"-\"}");
						}
					}
					buffer.getJSONObject(i).remove("targetElement");
					buffer.getJSONObject(i).put("targetElement", targetElement.toString());
				}

				// Insert @class key for Jackson mapping
				if (buffer.getJSONObject(i).has("messageType")) {
					String mType = buffer.getJSONObject(i).get("messageType")
							.toString();

					// Maybe better to change mType to ENUM and use switch
					// instead of 'if's
					if (mType.contains("FUNCTION_CALL")) {
						buffer.getJSONObject(i).put("@class",
								"com.metis.core.trace.FunctionCall");
						JSONLabel = "\"FunctionTrace\":";
					} else if (mType.contains("FUNCTION_ENTER")) {
						buffer.getJSONObject(i).put("@class",
								"com.metis.core.trace.FunctionEnter");
						JSONLabel = "\"FunctionTrace\":";
					} else if (mType.contains("FUNCTION_EXIT")) {
						buffer.getJSONObject(i).put("@class",
								"com.metis.core.trace.FunctionExit");
						JSONLabel = "\"FunctionTrace\":";
					} else if (mType.contains("DOM_EVENT")) {
						buffer.getJSONObject(i).put("@class",
								"com.metis.core.trace.DOMEventTrace");
						JSONLabel = "\"DOMEventTrace\":";
					} else if (mType.contains("TIMEOUT_SET")) {
						buffer.getJSONObject(i).put("@class",
								"com.metis.core.trace.TimeoutSet");
						JSONLabel = "\"TimingTrace\":";
					} else if (mType.contains("TIMEOUT_CALLBACK")) {
						buffer.getJSONObject(i).put("@class",
								"com.metis.core.trace.TimeoutCallback");
						JSONLabel = "\"TimingTrace\":";
					} else if (mType.contains("XHR_OPEN")) {
						buffer.getJSONObject(i).put("@class",
								"com.metis.core.trace.XMLHttpRequestOpen");
						JSONLabel = "\"XHRTrace\":";
					} else if (mType.contains("XHR_SEND")) {
						buffer.getJSONObject(i).put("@class",
								"com.metis.core.trace.XMLHttpRequestSend");
						JSONLabel = "\"XHRTrace\":";
					} else if (mType.contains("XHR_RESPONSE")) {
						buffer.getJSONObject(i).put("@class",
								"com.metis.core.trace.XMLHttpRequestResponse");
						JSONLabel = "\"XHRTrace\":";
					}
					// messageType obsolete
					buffer.getJSONObject(i).remove("messageType");
				}

				System.out.print(JSONLabel + "["
						+ buffer.getJSONObject(i).toString(2) + "]");
			}

			/* Restore the old system.out */
			System.setOut(oldOut);

		} catch (JSONException e) {
			e.printStackTrace();
		}

	}

}
