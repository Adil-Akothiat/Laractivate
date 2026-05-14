import { useAccounts, useAccountsFilter } from '@/features/base/accounts';
import { DataTable } from '@/components/Table/index';
import AccountsHeader from './AccountsHeader';
import { columns } from './AccountColumns';
import { useState } from 'react';
import CreateAccount from './CreateAccount';
import { Pagination } from '@/components';
import { useDebounce } from '@/app/hooks/common/useDebounce';
import { ScrollContainer } from '@/components/ScrollContainer';
import type { UserSchema } from '@/features/base/shared';
  
export default function AccountsTable() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { search, role, status } = useAccountsFilter();
  const debouncedSearch = useDebounce(search, 100);
  
  const { data, isPending } = useAccounts({ page, search:debouncedSearch, role, status });
  const response = data?.data;
  console.log(response);
  const users = response?.data || [];
  const meta = response?.meta;
  return (
    <ScrollContainer>
      <AccountsHeader
        newAccountHandler={() => setOpen(true)}
        searchResult={meta?.total}
        roles={[]}
      />
      <CreateAccount 
        isOpen={open}
        onClose={() => setOpen(false)}
      />
      <DataTable<UserSchema>
        pinRows
        columns={columns}
        data={users}
        keyExtractor={(row:UserSchema) => row.id}
        loading={isPending}
        skeletonRows={5}
        emptyMessage="No users found."
        actions={[
          {
            label:      'More',
            href:       (row:UserSchema) => `/accounts/${row.id}`,
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