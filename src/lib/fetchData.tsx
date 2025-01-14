import axios from 'axios';

export const fetchAllProducts = async () => {
  try {
    const response = await axios.get('https://dummyjson.com/products');
    
    // console.log(response.data);

    return response.data.products;
  } catch (error) {
    console.error('Veri çekme hatası:', error);
    throw error; 
  }
};

