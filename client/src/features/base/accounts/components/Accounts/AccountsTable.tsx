import { type ManagedUser ,useAccounts, useAccountsFilter } from '@/features/base/accounts';
import { DataTable } from '@/components/Table/index';
import AccountsHeader from './AccountsHeader';
import { columns } from './AccountColumns';
import { useState } from 'react';
import CreateAccount from './CreateAccount';
import { Pagination } from '@/components';
import { useDebounce } from '@/app/hooks/useDebounce';
import { ScrollContainer } from '@/components/ScrollContainer';
  
export default function AccountsTable() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { search, role, status } = useAccountsFilter();
  const debouncedSearch = useDebounce(search, 100);
  const { data, isPending } = useAccounts.getAccounts({ page, search:debouncedSearch, role, status });
  const users = data?.accounts || [];
  const meta = data?.meta;
  return (
    <ScrollContainer>
      <AccountsHeader
        newAccountHandler={() => setOpen(true)}
        searchResult={meta?.total}
        roles={data?.roles || []}
      />
      <CreateAccount 
        isOpen={open}
        onClose={() => setOpen(false)}
        roles={data?.roles ?? []}
      />
      <DataTable<ManagedUser>
        pinRows
        columns={columns}
        data={users}
        keyExtractor={(row:ManagedUser) => row.id}
        loading={isPending}
        skeletonRows={5}
        emptyMessage="No users found."
        actions={[
          {
            label:      'More',
            href:       (row:ManagedUser) => `/accounts/${row.id}`,
            permission:"all,accounts.manage"
          }
        ]}
      />
      <Pagination
        currentPage={page}
        totalPages={meta?.last_page || 1}
        total={meta?.total || 0}
        perPage={meta?.per_page}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </ScrollContainer>
  );
};