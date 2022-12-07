public inherited sharing class TalonConnector {

    @AuraEnabled
    public static map<String, Object> retrieveCoupon(Map<String,Object> params ){
        map<String, Object> mapJsonData = new map<String, Object>();
        String strResponse = null;
		TalonVouchers__c settings = TalonVouchers__c.getOrgDefaults();
        System.debug(settings);
        String strEndPointURL = settings.URI__c;
        System.debug(strEndPointUrl);
        if(String.isNotBlank(strEndPointURL)) {
            HttpRequest httpRequest = new HttpRequest();  
            httpRequest.setEndpoint(strEndPointURL);

            httpRequest.setMethod('POST');   
            httpRequest.setHeader('Authorization', 'ApiKey-v1 '+settings.AuthToken__c);        
            httpRequest.setBody(json.serialize(params));
            try {  
                Http http = new Http();   
                HttpResponse httpResponse = http.send(httpRequest);  

                while(httpResponse.getStatusCode() == 302) {
                    httpRequest.setEndpoint(httpResponse.getHeader('Location'));
                    httpResponse = new Http().send(httpRequest);
                }

                if (httpResponse.getStatusCode() == 200 ) {  
                    strResponse = httpResponse.getBody();  
                } 
                else {  
                    throw new CalloutException(httpResponse.getBody());  
                }   
            } 
            catch(Exception ex) {  
                throw ex;  
            }  
        } 

        if(!String.isBlank(strResponse)) {
            mapJsonData = (map<String, Object>)JSON.deserializeUntyped(strResponse);
            System.debug('mapJsonData ===> '+mapJsonData);
        }

        if(!mapJsonData.isEmpty()) {
            return mapJsonData;
        }
        else {
            return null;
        }
    }
}