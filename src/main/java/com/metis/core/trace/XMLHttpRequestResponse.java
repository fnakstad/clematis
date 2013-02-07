package com.metis.core.trace;

public class XMLHttpRequestResponse extends XMLHttpRequestTrace {
	private String callbackFunction; // Function type ?
	private String response;

	public String getCallbackFunction() {
		return callbackFunction;
	}
	public void setCallbackFunction(String callbackFunction) {
		this.callbackFunction = callbackFunction;
	}
	public String getResponse() {
		return response;
	}
	public void setResponse(String response) {
		this.response = response;
	}	
}