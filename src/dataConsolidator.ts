import * as fs from "fs";
import { User, Bulletin } from "./interfaces";
import { DataFetcher } from "./dataFetcher";

export class DataConsolidator {
  static async fetchAndSaveData(jsonFilePath: string): Promise<Bulletin[]> {
    const [usersData, photosData, postsData] = await Promise.all([
      DataFetcher.fetchUsers(),
      DataFetcher.fetchPhotos(),
      DataFetcher.fetchPosts(),
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
          imageUrl: photo.url,
        };
        bulletins.push(bulletin);
      }
    });

    const consolidatedData = { bulletins };
    fs.writeFileSync(jsonFilePath, JSON.stringify(consolidatedData, null, 2));
    return bulletins;
  }

  static checkJsonFile(jsonFilePath: string): any | null {
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
  }
}
