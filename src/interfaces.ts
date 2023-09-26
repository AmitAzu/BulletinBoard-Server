export interface User {
  id: number;
  username: string;
  address: {
    geo: {
      lat: string;
      lng: string;
    };
  };
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface Photo {
  id: number;
  url: string;
}

export interface Bulletin {
  id: number;
  title: string;
  userName: string;
  geo: {
    lat: string;
    lng: string;
  };
  imageUrl: string;
}
