interface IFoto {
  data: {
    height: number,
    is_silhouette: boolean,
    url: string,
    width: number
  }
}

export interface IRespuestaFacebook {
  
  id: string;

  name: string;

  picture: IFoto
}