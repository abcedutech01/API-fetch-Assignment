//importing neccesary files and components with prime react datatable and column   
import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { Artwork } from '../types';

//exportable function

function ArtworkTable() {

    // main variables
    const [data, setData] = useState<Artwork[]>([]);
    const [load, setLoad] = useState(false);

    //variable for set for page and total records
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    //variable for selecting rows
    const [selectedIds, setSelectedIds] = useState(new Set());

    //for counting the selected rows
    const [count, setCount] = useState(0);

    //rows show per page
    const rows = 10;

    //fetch data pagewise
    useEffect(() => {
        getData(page);
    }, [page]);

    //fetching the api
    async function getData(p: number) {
        setLoad(true);

        const r = await fetch(
            'https://api.artic.edu/api/v1/artworks?page=' + p
        );

        //converting into json file type to response

        const j = await r.json();

        //setting the json data into total records
        setData(j.data);
        setTotal(j.pagination.total);

        //once data set setload is false
        setLoad(false);
    }

    //this function is for changing the page
    function changePage(e: any) {
        setPage(e.page + 1);
    }

    //this is for selecting rows on page
    const selectedOnPage = data.filter(d => {
        return selectedIds.has(d.id);
    });

    //this function is for selecting and storing the selected rows that doesn't effect after page changes
    function temp(e: any) {
        const temp = new Set(selectedIds);
        e.value.forEach((x: Artwork) => {
            temp.add(x.id);
        });

        //this is for deselecting rows
        data.forEach(d => {
            const found = e.value.find((v: Artwork) => v.id === d.id);
            if (!found) {
                temp.delete(d.id);
            }
        });

        //using varible gor counting seleceted rows

        setSelectedIds(temp);
        setCount(temp.size);
    }

    return (
    
        //returning all the fetched databse
    <>
            <p style={{ margin: "10px 0px 10px 0px", color: "black",backgroundColor: "transparent", width: "10%", padding:"5px"}}>{count} items selected</p>
        <DataTable
            style={{ borderRadius: "20px", backgroundColor: "white" }}
            value={data}
            paginator
            lazy
            rows={rows}
            totalRecords={total}
            loading={load}
            first={(page - 1) * rows}
            onPage={changePage}
            selection={selectedOnPage}
            onSelectionChange={temp}
            selectionMode="checkbox"
            dataKey="id"
            paginatorTemplate="PrevPageLink PageLinks NextPageLink CurrentPageReport"
        >
            <Column selectionMode="multiple" style={{ width: '3rem' }} />
            <Column field="title" header="Title" />
            <Column field="place_of_origin" header="Origin" />
            <Column field="artist_display" header="Artist" />
            <Column field="inscriptions" header="Inscriptions" />
            <Column field="date_start" header="Start Date" />
            <Column field="date_end" header="End Date" />
        </DataTable>
    </>
    );
}
    // exporting the main component
export default ArtworkTable;