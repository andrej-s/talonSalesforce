(
	{
    handleSeverity: function (cmp, event) {
        // This will contain the string of the "value" attribute of the selected option
        var selectedOptionValue = event.getParam("value");
        cmp.set("v.selectedSeverity", selectedOptionValue);
    },
    handleArea: function (cmp, event) {
        // This will contain the string of the "value" attribute of the selected option
        var selectedOptionValue = event.getParam("value");
        cmp.set("v.selectedArea", selectedOptionValue);
    },
    
	createCoupon: function (cmp, event) {
        var severity = cmp.get("v.selectedSeverity");
        var area = cmp.get("v.selectedArea");
        var dealSize = cmp.get("v.dealSize");

        var action = cmp.get("c.retrieveCoupon");
        action.setParams({
        params:  {
            profileId: "agent",
            type: area,
            attributes: {
            	severity: severity,
                dealSize: Number(dealSize)
			}
        }
		});

        // Create a callback that is executed after 
        // the server-side action returns
        action.setCallback(this, function(response) {
            console.warn("callback");
            var state = response.getState();
            console.warn(state);
            if (state === "SUCCESS") {
                var voucher = "no voucher";
                var voucherDescription = "";
                console.warn(response.getReturnValue());
                const createdCoupons = response.getReturnValue().createdCoupons;
                if(createdCoupons.length > 0) {
                    voucher = createdCoupons[0].value;
                    voucherDescription = createdCoupons[0].attributes.Description;
                }
                cmp.set('v.voucher', voucher);
                cmp.set('v.voucherDescription', voucherDescription);
			    $A.util.toggleClass(cmp.find("voucherDiv"), "slds-hide");    
                $A.util.toggleClass(cmp.find("creationDiv"), "slds-hide");    
            }  else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            } 
        })
        
 		$A.enqueueAction(action);
    }
})