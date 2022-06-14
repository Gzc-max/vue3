import { reactive } from "vue";
function handleList() {
  const list = reactive([
    { id: 0, name: "Tom" },
    { id: 1, name: "Joy" },
    { id: 2, name: "Ming" },
  ]);
  return list;
}

export default handleList;
