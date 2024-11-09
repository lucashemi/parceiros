const formatarLinkImagem = (sharedLink: string) => {
    const driveLinkPattern = /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view\?usp=drivesdk$/;
    const match = sharedLink.match(driveLinkPattern);

    if (match) {
        const fileId = match[1];
        return `https://lh3.google.com/u/0/d/${fileId}`;
    } else {
        console.error("Erro ao gerar link compartilhável!");
        return "";
    }
}

export default formatarLinkImagem;