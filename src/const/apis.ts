const booksApi = async (option) => {
    try {
        const res = await fetch(`https://openlibrary.org/search.json?q=${option}&limit=200`);

        const data = await res.json();

        return data.docs;
    } catch (error) {
        console.error('Error fetching random books:', error);
        return [];
    }
};

export { booksApi };