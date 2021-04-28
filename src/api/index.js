import axios from "axios";
export const getPaymentAddress = (pixelCount) =>
    axios
        .request({
            method: 'post',
            timeout: 4000,
            url: `${process.env.VUE_APP_API}/payment`,
            data: {
                pixelCount
            }
        })
        .then((response) => Promise.resolve(response.data.address))
        .catch((err) => Promise.reject(err.data));
