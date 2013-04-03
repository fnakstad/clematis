package com.metis.core.trace;

import org.json.JSONException;
import org.json.JSONObject;

import com.metis.core.episode.EpisodeSource;

public class DOMElementValueTrace extends TraceObject/* implements EpisodeSource */{
	private String elementId;
	private String elementType;
	private String nodeType;
	private String nodeName;
	private String oldValue;
	private String newValue;

	public DOMElementValueTrace() {
		super();
		setEpisodeSource(true);
	}

	public String getElementId() {
		return elementId;
	}

	public void setElementId(String elementId) {
		this.elementId = elementId;
	}

	public String getElementType() {
		return elementType;
	}

	public void setElementType(String elementType) {
		this.elementType = elementType;
	}

	public String getNodeType() {
		return nodeType;
	}

	public void setNodeType(String nodeType) {
		this.nodeType = nodeType;
	}

	public String getNodeName() {
		return nodeName;
	}

	public void setNodeName(String nodeName) {
		this.nodeName = nodeName;
	}

	public String getOldValue() {
		return oldValue;
	}

	public void setOldValue(String oldValue) {
		this.oldValue = oldValue;
	}

	public String getNewValue() {
		return newValue;
	}

	public void setNewValue(String newValue) {
		this.newValue = newValue;
	}
	
	public JSONObject getValueChangeAsJSON() {
		JSONObject returnObject = new JSONObject();

		try {
			returnObject.put("elementId", this.elementId);
			returnObject.put("elementType", this.elementType);
			//returnObject.put("nodeType", this.nodeType);
			//returnObject.put("nodeName", this.nodeName);
			returnObject.put("oldValue", this.oldValue);
			returnObject.put("newValue", this.newValue);
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return returnObject;
	}

}
