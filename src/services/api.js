import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseURL = 'https://yelp-combinator.louiscohen.me/api/';

export const loadAllCollectionItems = async () => {
    const [items, setItems] = useState([]);

}

export const api = axios.create({
    baseURL,
});