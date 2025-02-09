import { watch, access, constants } from "fs";
import { spawn } from "child_process";

const folderToWatch =
  "D:/0 minecraft server/playlegend rank plugin test/plugins";

// fun little stat: restart count
let i = 0;

const main = () => {
  console.log("init auto restart script");

  watch(folderToWatch, { recursive: true }, (eventType, fileName) => {
    if (fileName) {
      console.log(`File ${fileName} changed: ${eventType}`);

      // only restart the server if a plugin got deleted
      // this basically confirms that the server is currently not running since you cant del a plugin
      // from a running server
      if (eventType === "rename") {
        access(folderToWatch + "/" + fileName, constants.F_OK, (err) => {
          // file is NOT OK
          if (err) {
            console.log(`${fileName} got deleted, restarting`);
            restartServer();
            return;
          }
          console.log("saw the change but its wasnt a delete operation");
        });
      }
    } else {
      console.log("Filename not provided");
    }
  });
};

const restartServer = () => {
  console.log("file change detected...");
  console.log("restarting server");

  const process = spawn(
    "cmd.exe",
    ["/c", `"D:/0 minecraft server/playlegend rank plugin test/start.bat"`],
    { shell: true }
  );

  process.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
    return;
  });

  process.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    return;
  });

  process.on("close", (code) => {
    console.log(`Server restart script exited with code ${code}`);
    return;
  });

  i++;
  console.log(`[${i}] starting server...`);
};

main();
