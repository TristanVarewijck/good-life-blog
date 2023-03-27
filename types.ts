export interface headingProps {
  title: string;
  subtitle?: string;
  isCentered?:boolean;
}

export interface categorieProps {
  uid: string;
  name: string;
  posts: postProps[]
}

export interface postProps {
  uid: number;
  title: string;
  content: string;
  slug: string; 
  publishedAt: string;
  cover: {
    alt: string, 
    url: string
  }; 
}