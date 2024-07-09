/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { filterBusinesses } from '../utils/utils';
import { useBusinessData } from '../services/api';

const SearchContext = createContext();

export const SearchContextProvider = ({ children }) => {
    const businessQuery = useBusinessData(false);
    const businesses = businessQuery.data;

    const [selectedBusiness, setSelectedBusiness] = useState();
    const [filteredBusinesses, setFilteredBusinesses] = useState();

    const [searchQuery, setSearchQuery] = useState('');
    const [visitedFilter, setVisitedFilter] = useState();
    const [isOpenFilter, setIsOpenFilter] = useState();

    useEffect(() => {
        console.log('searchQuery', searchQuery);
        // const filtered = businesses.
    }, [searchQuery]);

    return (
        <SearchContext.Provider 
            value={{ 
                businesses,
                selectedBusiness, 
                setSelectedBusiness, 
                filteredBusinesses, 
                setFilteredBusinesses,
                searchQuery,
                setSearchQuery,
                visitedFilter,
                setVisitedFilter,
                isOpenFilter,
                setIsOpenFilter,
            }}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearchContext = () => useContext(SearchContext);