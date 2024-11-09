const delay = (s: number) => {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

export default delay;