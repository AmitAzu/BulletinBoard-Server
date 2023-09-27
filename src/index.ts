import express from "express";
import axios from "axios";
import * as fs from "fs";
import { User, Photo, Post, Bulletin } from "./interfaces";

export const app = express();
const port = 3000;
const jsonFilePath = "consolidatedData.json";
app.use(express.json());

const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return response.data;
};

const fetchPhotos = async (): Promise<Photo[]> => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/photos"
  );
  return response.data;
};

const fetchPosts = async (): Promise<Post[]> => {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return response.data;
};

const fetchAndSaveData = async () => {
  const [usersData, photosData, postsData] = await Promise.all([
    fetchUsers(),
    fetchPhotos(),
    fetchPosts(),
  ]);

  const usersMap = new Map<number, User>();
  usersData.forEach((user) => usersMap.set(user.id, user));

  const bulletins: Bulletin[] = [];

  postsData.forEach((post) => {
    const user = usersMap.get(post.userId);
    const photo = photosData.find((p) => p.id === post.id);

    if (user && photo) {
      const bulletin: Bulletin = {
        id: post.id,
        title: post.title,
        userName: user.username,
        body: post.body,
        geo: user.address.geo,
        imageUrl: photo.url
      };
      bulletins.push(bulletin);
    }
  });
  const consolidatedData = { bulletins };
  fs.writeFileSync(jsonFilePath, JSON.stringify(consolidatedData, null, 2));
  return bulletins;
};

const checkJsonFile = () => {
  try {
    if (fs.existsSync(jsonFilePath)) {
      const data = fs.readFileSync(jsonFilePath, "utf-8");
      return JSON.parse(data);
    }
    return null; 
  } catch (error) {
    console.error(`Error reading JSON file: ${error}`);
    return null;
  }
};

app.post("/addBulletin", (req, res) => {
  try {
    const existingData = fs.existsSync(jsonFilePath)
      ? JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"))
      : { bulletins: [] };

    const newBulletin = {
      id: req.body.id,
      title: req.body.title,
      userName: req.body.userName,
      body: req.body.body,
      geo: req.body.geo,
      imageUrl: req.body.imageUrl
    };

    existingData.bulletins.unshift(newBulletin);

    fs.writeFileSync(jsonFilePath, JSON.stringify(existingData, null, 2));
    console.debug(`Bulletin id: ${newBulletin.id} added successfully`);
    res.json({
      message: "Bulletin added successfully",
      bulletin: newBulletin,
    });
  } catch (error) {
    console.error(`Error adding Bulletin: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getBulletin", async (req, res) => {
  try {
    const cachedData = checkJsonFile();

    if (cachedData) {
      console.debug(`Bulletins saved locally were sent successfully.`);
      res.json(cachedData);
    } else {
      const bulletins = await fetchAndSaveData();
      console.debug(`${bulletins.length} Bulletins were reimported and sent successfully.`);
      res.json({ bulletins });
    }
  } catch (error) {
    console.error(`Error consolidating data: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/deleteBulletin/:id", (req, res) => {
  try {
    const bulletinIdToDelete = req.params.id;

    const rawData = fs.readFileSync("consolidatedData.json", "utf8");
    const consolidatedData = JSON.parse(rawData);

    const bulletinIndex = consolidatedData.bulletins.findIndex(
      (bulletin: Bulletin) => bulletin.id === Number(bulletinIdToDelete)
    );

    if (bulletinIndex === -1) {
      console.error(`Bulletin ID: ${req.params.id} not found, and therefore, the deletion failed.`)
      res.status(404).json({ error: "Bulletin not found" });
    } else {
      consolidatedData.bulletins.splice(bulletinIndex, 1);

      fs.writeFileSync(
        "consolidatedData.json",
        JSON.stringify(consolidatedData, null, 2)
      );
      console.debug(`Bulletin id: ${req.params.id} deleted successfully`)
      res.json({ message: "Bulletin deleted successfully" });
    }
  } catch (error) {
    console.error(`Error deleting bulletin: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// delete json local file for tests
// process.on('SIGINT', async () => {
//   try {
//       await fs.promises.unlink(jsonFilePath);
//       process.exit(0);
//   } catch (err) {
//       process.exit(1); 
//   }
// });

