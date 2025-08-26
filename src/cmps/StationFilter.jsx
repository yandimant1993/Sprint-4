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
                <h3>Filter WIP</h3>
                {/* <input
                    type="text"
                    name="txt"
                    value={filterToEdit.txt}
                    placeholder="What do you want to play?"
                    onChange={handleChange}
                    required
                /> */}
            </section>
        </form>
    )
}