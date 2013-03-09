package com.metis.visual;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Date;

import org.jgrapht.ext.DOTExporter;
import org.jgrapht.ext.StringEdgeNameProvider;
import org.jgrapht.ext.StringNameProvider;
import org.jgrapht.graph.DefaultEdge;
import org.jgrapht.graph.DirectedMultigraph;

import com.crawljax.util.Helper;
import com.metis.core.episode.Episode;
import com.metis.core.trace.TimingTrace;
import com.metis.core.trace.TraceObject;
import com.metis.core.trace.XMLHttpRequestTrace;

public class EpisodeGraph {

	ArrayList<Episode> el = new ArrayList<Episode>();
	private String outputFolder = "";
	// New states are assigned IDs based on the number of states/vertices present
	private DirectedMultigraph<String, RelationshipEdge> dirGraph;
	private DOTExporter dotexporter = null;

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public EpisodeGraph (String outputFolder, ArrayList<Episode> el) {
		this.el.addAll(el);
		Date d = new Date();

		try {
			// Set directory/output for graph
			Helper.directoryCheck(outputFolder+ "sequence_diagrams/");
			this.outputFolder = outputFolder;

			// Exporting state machine etc.
			StringNameProvider<String> vertexIDProvider = new StringNameProvider<String>();
			StringNameProvider<String> vertexLabelProvider = new StringNameProvider<String>();
			StringEdgeNameProvider<String> edgeLabelProvider = new StringEdgeNameProvider<String>();
			dotexporter = new DOTExporter(vertexIDProvider, vertexLabelProvider, edgeLabelProvider);

			// Create a graph based on String objects
			dirGraph = new DirectedMultigraph<String, RelationshipEdge>(RelationshipEdge.class);

			// Note directed edges are printed as: (<v1>,<v2>)
			System.out.println("Directed graph initialized: " + dirGraph.toString());

		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	@SuppressWarnings("unchecked")
	public void createGraph() {
		Date d = new Date();
		FileWriter fos;

		for (Episode e: el){
			// Populate graph with an edge for each episode
			addVertex(e);
		}
		for (int i = 0; i< el.size()-1; i++) {
			// Add linear edges between each episode and its successor
			addEdge("E"+el.get(i).getSource().getCounter(), 
					"E"+el.get(i+1).getSource().getCounter(), 
					null);
		}
		for (int i = 0; i< el.size(); i++) {
			// Add causal edges between episodes
			Episode currentEpisode = el.get(i);

			// If the source is not included in the trace, add it
			if(!currentEpisode.getTrace().getTrace().contains(currentEpisode.getSource())) {
				// Need entire episode (including source) when looking for causality
				currentEpisode.getTrace().addToTrace(currentEpisode.getSource());
			}

			for (TraceObject to : currentEpisode.getTrace().getTrace()) {
				// Iterate through each TraceObject in the Episode
				if (to.getClass().toString().contains("TimeoutCallback")
						|| to.getClass().toString().contains("XMLHttpRequestResponse")) {
					// Need to look for origin of Timeout or XMLHttpRequest in other Episodes
					for (int j = 0; j< el.size(); j++) {
						Episode otherEpisode = el.get(j);

						if (i == j) {
							// Skip searching in the same current episode
							continue;
						}

						if (!otherEpisode.getTrace().getTrace().contains(otherEpisode.getSource())) {
							otherEpisode.getTrace().addToTrace(otherEpisode.getSource());
						}

						for (TraceObject to2 : otherEpisode.getTrace().getTrace()) {
							if (to.getClass().toString().contains("XMLHttpRequestResponse")
									&& to2.getClass().toString().contains("XMLHttpRequest")
									&& to2.getId() == to.getId()){
								// Found source of XMLHttpRequest
								addEdge("E"+currentEpisode.getSource().getCounter(), 
										"E"+otherEpisode.getSource().getCounter(), 
										to2);
								break;
							} else if (to2.getClass().toString().contains("TimeoutSet")
									&& to.getClass().toString().contains("TimeoutCallback")
									&& to.getId() == to2.getId()){
								// Found source of TimingEvent
								addEdge("E"+currentEpisode.getSource().getCounter(), 
										"E"+otherEpisode.getSource().getCounter(), 
										to2);
								break;
							}
						}

					}
				} // Otherwise no need to add causal link for TraceObject
			}
		}

		// Export DirectedMultigraph as dot file
		try {
			fos = new FileWriter(outputFolder+"sequence_diagrams/"+"story_"+d.getTime()+".dot");
			dotexporter.export(fos, dirGraph);
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	private String addVertex(Episode e)
	{
		String newVertex = "E" + e.getSource().getCounter();

		try {
			// Add the vertex
			dirGraph.addVertex(newVertex);
		} catch (Exception ee) {
			System.out.println("addVertex: Error adding vertex to dir. graph.");
			ee.printStackTrace();
		}
		return newVertex;
	}

	public void addEdge(String v1, String v2, TraceObject b1)
	{
		if (v1.equals(v2)) {
			// Loops are not allowed
			System.out.println("No loops allowed!");
			return;
		} 
		try {
			// Add the vertex
			dirGraph.addEdge(v1, v2, new RelationshipEdge<String>(v1, v2, b1));

		} catch (Exception eee) {
			System.out.println("addEdge: Error adding edge to dir. graph.");
			eee.printStackTrace();
		}
	}

	/**
	 * Custom class, allowing for a label to be attached to a DefaultEdge.
	 */
	class RelationshipEdge<V> extends DefaultEdge {
		// Source
		private V v1;
		// Destination
		private V v2;
		// Edge Label
		private String label;
		// Button
		private TraceObject b1;

		public RelationshipEdge(V v1, V v2, TraceObject b1) {
			this.v1 = v1;
			this.v2 = v2;

			if (b1 == null){
				this.label = " ";
			} else if (b1.getClass().toString().contains("Timeout")) {
				// TimingTrace
				this.label = "Timing ID: "+ b1.getId();
			} else {
				// XMLHttpRequestTrace
				this.label = "XHR ID: "+ b1.getId();
			}
			this.b1 = b1;
		}

		public V getV1() {
			return v1;
		}

		public V getV2() {
			return v2;
		}

		public String toString() {
			return label;
		}

		public TraceObject getTraceObject() {
			return b1;
		}
	}
}
