document.addEventListener("DOMContentLoaded", function () {
  // get a NodeList of items we care about
  const item_rows = document.querySelectorAll(".calculator .row:not(.total)");

  /**
    * Iterate through them
  */
  item_rows.forEach(function(row){
    /**
    * For each row establish an event listener for change and keyup
    *
    * To keep things DRY, we created a function called item_input_listener that fires for each addEventListener
    * This allows the same code to be used for multiple events
    */
    const qty_field = row.querySelector("input");
    qty_field.addEventListener("change", item_input_listener);
    qty_field.addEventListener("keyup", item_input_listener)
  });
}); //end DOM ready

function item_input_listener(e){
  const this_input = e.target; // the input field that emitted the event
  const row = this_input.closest(".row"); // the row that contains the input field that emitted the event
  const qty = this_input.value; // the quantity

  const shops = row.querySelectorAll(".amazon, .freshdirect, .peapod");

  shops.forEach(function(shop){
    // this shop's price
    let price = shop.dataset.price;

    price = parseFloat(price);

    const total = qty * price;

    shop.querySelector("span").innerHTML = round_number(total);
  });

  row.classList.add("active");
  calculate_totals();
}

function calculate_totals() {
  // get a NodeList of items we care about
  const item_rows = document.querySelectorAll(".calculator .row:not(.total)");

  let amazon = 0;
  let peapod = 0;
  let freshdirect = 0;

  item_rows.forEach(function(row){
    const qty_field = row.querySelector("input");
    let qty = qty_field.value;

    qty = parseFloat(qty);

    const shops = row.querySelectorAll(".amazon, .freshdirect, .peapod");

    shops.forEach(function(shop){
      // this shop's price
      let price = shop.dataset.price;

      price = parseFloat(price);

      const total = qty * price;

      if(shop.classList.contains("amazon")){
        amazon = amazon + total;
      }

      if(shop.classList.contains("freshdirect")){
        freshdirect = freshdirect + total;
      }

      if(shop.classList.contains("peapod")){
        peapod = peapod + total;
      }
    });

    const total_row = document.querySelector(".row.total");

    total_row.classList.add("active");

    total_row.querySelector(".amazon span").innerHTML = round_number(amazon);
    total_row.querySelector(".peapod span").innerHTML = round_number(peapod);
    total_row.querySelector(".freshdirect span").innerHTML = round_number(freshdirect);

    let cheapest = false;

    if(amazon < peapod && amazon < freshdirect){
      cheapest = 'amazon';
    }

    if(peapod < amazon && peapod < freshdirect){
      cheapest = 'peapod';
    }

    if(freshdirect < amazon && freshdirect < peapod){
      cheapest = 'freshdirect';
    }

    const cheapest_item = total_row.querySelector(".cheapest");

    if(cheapest_item){
      cheapest_item.classList.remove("cheapest");
    }

    if(cheapest !== false){
      total_row.querySelector(`.${cheapest}`).classList.add("cheapest");
    }

  });
}

function round_number(num) {
    //first, move the decimal two places
    num = num * 100;

    //then, round the number to the nearest integer
    num = Math.round(num);

    //then move the decimal back two places
    num = num / 100;

    // handle trailing zeroes
    num = num.toFixed(2);

    return num;
}
