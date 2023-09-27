import { BulletinServer } from "./bulletinServer";

const app = new BulletinServer("bulletins.json");
const port = 3000;
app.start(port);