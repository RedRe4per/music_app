export interface AlbumSong {
    id: number;
    name: string;
    mv: number;
    al: {
        id: number;
        name: string;
        pic: number;
        picUrl: string;
        pic_str: string;
    }
    ar: [{
        id: number;
        name: string;
        tns: string[];
    }]
}