import express from 'express';
import axios from 'axios';
import * as fs from 'fs';
import { User, Photo, Post, Bulletin } from './interfaces'

export const app = express();
const port = process.env.PORT || 3000;

const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users');
  return response.data;
};

const fetchPhotos = async (): Promise<Photo[]> => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/photos');
  return response.data;
};

const fetchPosts = async (): Promise<Post[]> => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
  return response.data;
};

export const createBulletins = async (): Promise<Bulletin[]> => {
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
        body: post.body,
        username: user.username,
        geo: user.address.geo,
        imageUrl: photo.url,
      };
      bulletins.push(bulletin);
    }
  });

  return bulletins;
};

app.get('/getBulletin', async (req, res) => {
  try {
    const bulletins = await createBulletins();

    const consolidatedData = {
      bulletins,
    };

    fs.writeFileSync('consolidatedData.json', JSON.stringify(consolidatedData, null, 2));

    res.json(consolidatedData);
  } catch (error) {
    console.error(`Error consolidating data: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

