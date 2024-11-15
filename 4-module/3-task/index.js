function highlight(table) {
  for (let tr of table.rows) {
    for (let td of tr.cells) {
      let tr = td.parentElement;

      if (td.dataset.available == "true") tr.classList.add("available");
      if (td.dataset.available == "false") tr.classList.add("unavailable");

      tr.hidden = tr.hidden = !td.hasAttribute("data-available");

      if (td.innerHTML == "m") tr.classList.add("male");
      if (td.innerHTML == "f") tr.classList.add("female");

      if (+td.innerHTML < 18) tr.style.textDecoration = "line-through";
    }
  }
}