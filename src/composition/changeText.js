import { ref } from "vue";
function changeTextFn(list) {
  const title = ref("");
  function changeText() {
    const tmp = { id: list.length + 1, name: title.value };
    title.value = "";
    list.push(tmp);
  }
  return { title, changeText };
}

export default changeTextFn;
