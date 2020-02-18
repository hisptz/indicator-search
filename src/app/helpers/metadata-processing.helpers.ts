import * as _ from "lodash";

export function formatMetadataExpression(info, response) {
  const referenceConstants = {
    "V{enrollment_date}": "Enrollment date ",
    "d2:daysBetween": "Days between ",
    "V{event_count}": "Count of events "
  };
  const formulaPattern = /#\{.+?\}/g;
  const replacingElement = /[#\{\}]/g;
  if (info["type"] === "programIndicatorExpression") {
    let newExpression = "";
    _.map(
      response["programStages"]
        ? response["programStages"]
        : response["dataElements"],
      elem => {
        newExpression = info["expressionData"]
          .replace(elem["id"], elem["name"])
          .replace("V{enrollment_date}", "Enrollment date")
          .replace("d2:daysBetween", "Days between ")
          .replace("V{event_count}", "Count of events ")
          .replace(replacingElement, "");
      }
    );
    return newExpression;
  } else {
    return response;
  }
}
