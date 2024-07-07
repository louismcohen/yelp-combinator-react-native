import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchContextProvider = ({ children }) => {
    const [selectedBusiness, setSelectedBusiness] = useState();
    const [filteredBusinesses, setFilteredBusinesses] = useState();
    const [visitedFilter, setVisitedFilter] = useState();
    const [isOpenFilter, setIsOpenFilter] = useState();

    return (
        <SearchContext.Provider 
            value={{ 
                selectedBusiness, 
                setSelectedBusiness, 
                filteredBusinesses, 
                setFilteredBusinesses,
                visitedFilter,
                setVisitedFilter,
                isOpenFilter,
                setIsOpenFilter,
            }}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearchContext = useContext(SearchContext);