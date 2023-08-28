const { symlink } = require("fs");
const { join } = require("path");

const sourcePath = "E:/programming/visual_studio_code/task-scheduler/context/taskContext.tsx";
const targetPath = "../node_modules/context/taskContext";

symlink(join(__dirname, targetPath), sourcePath, "file", (err) => {
  if (err) {
    if (err.code === "EEXIST") {
      symlink(join(__dirname, targetPath), sourcePath, "file", { force: true }, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Symlink created successfully!");
        }
      });
      console.log(err);
    }
  } else {
    console.log("Symlink created successfully!");
  }
});