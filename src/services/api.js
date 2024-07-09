import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiData from '../services/apiData.json';
import { getAllUniqueCategories, parseHours } from '../utils/utils';
import { generateHexColorFromCategoryAlias } from '../icons/IconGenerator';
import {
    useQuery,
    useMutation,
    useQueryClient,
  } from '@tanstack/react-query'

const baseURL = 'https://yelp-combinator.louiscohen.me/api/';

export const loadAllCollectionItems = async () => {
    const [items, setItems] = useState([]);

}

export const api = axios.create({
    baseURL,
});

export const processRawBusinesses = (rawBusinesses) => {
    const processedBusinesses = rawBusinesses.map(business => {
        const { openingMessage, hours } = parseHours(business);
        // console.log({openingMessage, hours})
        const iconHexColor = generateHexColorFromCategoryAlias(business.categories[0].alias);
        return {
            ...business,
            iconHexColor,
            hours,
            openingMessage,
        }
    })
    return processedBusinesses;
}

const getCollectionItems = async (useApiData) => {
    let data;
    if (useApiData) {
        const response = await api.get('');
        data = response.data;
    } else {
        data = apiData;
    }
    const processedData = processRawBusinesses(data);
    return processedData;
};

export const useBusinessData = (useApiData) => {
    const queryClient = useQueryClient();
    const businessesQuery = useQuery({
        queryKey: ['businesses'],
        queryFn: () => getCollectionItems(useApiData),
        placeholderData: [],
    });

    useEffect(() => {
        // console.log('businessesQuery.data', businessesQuery.data);
        if (businessesQuery.data) {
            const { data: businesses } = businessesQuery;
            businesses.map((business) => {
                queryClient.setQueryData(['business', business.alias], business)
            });

            const categories = getAllUniqueCategories(businesses);
            categories.map((category) => queryClient.setQueryData(['category', category]));
        }

    }, [businessesQuery.data])

    
    return businessesQuery;
}