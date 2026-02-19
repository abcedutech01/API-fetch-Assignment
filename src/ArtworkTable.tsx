import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { Artwork } from './types';

function ArtworkTable() {
    const [data, setData] = useState<Artwork[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // store only selected IDs
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const rows = 10;

    useEffect(() => {
        fetchData(page);
    }, [page]);

    async function fetchData(pageNo: number) {
        setLoading(true);

        const res = await fetch(
            `https://api.artic.edu/api/v1/artworks?page=${pageNo}`
        );
        const json = await res.json();

        setData(json.data);
        setTotal(json.pagination.total);

        setLoading(false);
    }

    // selected rows only for current page
    const selectedOnPage = data.filter(item =>
        selectedIds.has(item.id)
    );

    function onSelectionChange(e: any) {
        const newSet = new Set(selectedIds);

        // add selected
        e.value.forEach((item: Artwork) => {
            newSet.add(item.id);
        });

        // remove deselected from current page
        data.forEach(item => {
            if (!e.value.find((v: Artwork) => v.id === item.id)) {
                newSet.delete(item.id);
            }
        });

        setSelectedIds(newSet);
    }

    function onPageChange(e: any) {
        setPage(e.page + 1);
    }

    return (
        <DataTable
            value={data}
            paginator
            lazy
            rows={rows}
            totalRecords={total}
            loading={loading}
            first={(page - 1) * rows}
            onPage={onPageChange}
            selection={selectedOnPage}
            onSelectionChange={onSelectionChange}
            selectionMode="checkbox"
            dataKey="id"
            paginatorTemplate="PrevPageLink PageLinks NextPageLink">

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
