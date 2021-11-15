const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const genUID = (length: number = 5) => {
    let uid: string = '';
    for (let i = 0; i < length; i++) {
        const charIndex: number = Math.floor(Math.random() * CHARACTERS.length);
        uid += CHARACTERS[charIndex];
    }

    return uid;
};
