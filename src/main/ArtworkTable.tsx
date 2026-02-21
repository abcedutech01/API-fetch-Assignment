import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import type { Artwork } from '../types';

function ArtworkTable() {

    // main variables

    const [data, setData] = useState<Artwork[]>([]);
    const [load, setLoad] = useState(false);

    //variable for set for page and total records
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    //variable for selecting rows
    const [selectedIds, setSelectedIds] = useState(new Set());

    //rows count per page
    const rows = 10;

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

        setData(j.data);
        setTotal(j.pagination.total);

        setLoad(false);
    } 

    function changePage(e: any) {
        setPage(e.page + 1);
    }

    const selectedOnPage = data.filter(d => {
        return selectedIds.has(d.id);
    });

    function selectChange(e: any) {
        const temp = new Set(selectedIds);

        e.value.forEach((x: Artwork) => {
            temp.add(x.id);
        });

        data.forEach(d => {
            const found = e.value.find((v: Artwork) => v.id === d.id);
            if (!found) {
                temp.delete(d.id);
            }
        });

        setSelectedIds(temp);
    }

    return (
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
            onSelectionChange={selectChange}
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
    );
}

export default ArtworkTable;