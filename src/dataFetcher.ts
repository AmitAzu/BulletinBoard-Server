import axios from "axios";
import { User, Photo, Post } from "./interfaces";

export class DataFetcher {
  private static baseUrl = "https://jsonplaceholder.typicode.com";

  static async fetchUsers(): Promise<User[]> {
    const response = await axios.get(`${this.baseUrl}/users`);
    return response.data;
  }

  static async fetchPhotos(): Promise<Photo[]> {
    const response = await axios.get(`${this.baseUrl}/photos`);
    return response.data;
  }

  static async fetchPosts(): Promise<Post[]> {
    const response = await axios.get(`${this.baseUrl}/posts`);
    return response.data;
  }
}
