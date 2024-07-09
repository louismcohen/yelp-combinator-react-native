/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { filterBusinesses } from '../utils/utils';
import { useBusinessData } from '../services/api';
import { useDebouncedState } from '../hooks/utils';

const SearchContext = createContext();

export const SearchContextProvider = ({ children }) => {
    const businessQuery = useBusinessData(false);
    const businesses = businessQuery.data;

    const [selectedBusiness, setSelectedBusiness] = useState();
    const [filteredBusinesses, setFilteredBusinesses] = useState([]);

    const [[searchQuery, debouncedSearchQuery], setSearchQuery] = useDebouncedState('', 200);
    const [visitedFilter, setVisitedFilter] = useState(0);
    const [isOpenFilter, setIsOpenFilter] = useState(0);

    useEffect(() => {
        // if (!filteredBusinesses && businesses.length > 0) {
            console.info(filterBusinesses, businesses);
            setFilteredBusinesses(businesses);
        // }
    }, [businesses])

    useEffect(() => {
        const filtered = businesses.filter((business) => filterBusinesses(business, debouncedSearchQuery, visitedFilter, isOpenFilter));
        setFilteredBusinesses(filtered);
    }, [debouncedSearchQuery, visitedFilter, isOpenFilter]);

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