import { useState, useEffect } from 'react'

export function StationFilter({ filterBy, onSetFilter }) {
    const [filterToEdit, setFilterToEdit] = useState(structuredClone(filterBy))

    useEffect(() => {
        onSetFilter(filterToEdit)
    }, [filterToEdit])

    function handleChange(ev) {
        const type = ev.target.type
        const field = ev.target.name
        let value

        switch (type) {
            case 'text':
            case 'radio':
                value = field === 'sortDir' ? +ev.target.value : ev.target.value
                if (!filterToEdit.sortDir) filterToEdit.sortDir = 1
                break
            case 'number':
                value = +ev.target.value || ''
                break
        }
        setFilterToEdit({ ...filterToEdit, [field]: value })
    }

    function clearFilter() {
        setFilterToEdit({ ...filterToEdit, txt: '', minAddedAt: '' })
    }


    function clearSort() {
        setFilterToEdit({ ...filterToEdit, sortField: '', sortDir: '' })
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterToEdit)
    }
    
    if (!filterToEdit) return <h3>Loading...</h3>
    return (

        <form onSubmit={onSubmitFilter}>

            <section className="station-filter">
                <h3>Filter:</h3>
                <input
                    type="text"
                    name="txt"
                    value={filterToEdit.txt}
                    placeholder="Free text"
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    min="0"
                    name="minAddedAt"
                    value={filterToEdit.minAddedAt}
                    placeholder="min. addedat"
                    onChange={handleChange}
                    required
                />
                <button
                    className="btn-clear"
                    onClick={clearFilter}>Clear</button>
                <h3>Sort:</h3>
                <div className="sort-field">
                    <label>
                        <span>AddedAt</span>
                        <input
                            type="radio"
                            name="sortField"
                            value="addedat"
                            checked={filterToEdit.sortField === 'addedat'}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        <span>Name</span>
                        <input
                            type="radio"
                            name="sortField"
                            value="name"
                            checked={filterToEdit.sortField === 'name'}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className="sort-dir">
                    <label>
                        <span>Asce</span>
                        <input
                            type="radio"
                            name="sortDir"
                            value="1"
                            checked={filterToEdit.sortDir === 1}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        <span>Desc</span>
                        <input
                            type="radio"
                            name="sortDir"
                            value="-1"
                            onChange={handleChange}
                            checked={filterToEdit.sortDir === -1}
                        />
                    </label>
                </div>
                <button
                    className="btn-clear"
                    onClick={clearSort}>Clear</button>
            </section>
        </form>
    )
}