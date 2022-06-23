function isISODate(val) {
  if (
    /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})[+-](\d{2})\:(\d{2})/.test(
      val
    )
  ) {
    return true;
  }
  if (/(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})[Z]/.test(val)) {
    return true;
  }
}

function formatArrayString(val) {
  return val.join(", ");
}

function formatDate(val) {
  return moment(val).format("MMM Do YYYY");
}

//formats custom fields
function formatCustomFields(values, cust_field, custArr) {
  for (let i = 0; i < cust_field.length; i++) {
    let key = cust_field[i];
    let val;
    (values[key] && values[key] != " ") ? val = values[key] : val = "N/A";
    custArr.push(
      '<div><span class="muted ucwords" style="color:#475867;margin-right: 2%;">' +
      key.replace("_", " ").charAt(0).toUpperCase() + key.slice(1) +
      "</span>",
      ": ",
      '<span class="muted ucwords">' +
      xss_test(val) +
      "</span>",
      "<br/></div>"
    );
  }
  return custArr.join("");
}

function xss_test(name) {
  return $("<span></span>").text(name)[0].innerHTML;
}

function isValNotEmpty(val) {
  return !!val && val.toString().trim().length > 0;
}
