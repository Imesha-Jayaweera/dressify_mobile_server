export const generateOTP = () => {
    return parseInt(
        Math.floor(100000 + Math.random() * 900000)
            .toString()
            .slice(0, 4),
        10
    );
};