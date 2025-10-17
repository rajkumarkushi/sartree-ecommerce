import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { userAPI } from '@/api/modules/user';

type Address = {
  id?: number;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state?: string;
  zip_code: string;
  country?: string;
  is_default?: number;
};

const Addresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await userAPI.getAddresses();
      const list = Array.isArray(data?.data) ? data.data : (data || []);
      setAddresses(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload: Address = {
      address_line_1: String(form.get('address_line_1') || ''),
      address_line_2: String(form.get('address_line_2') || ''),
      city: String(form.get('city') || ''),
      state: String(form.get('state') || ''),
      zip_code: String(form.get('zip_code') || ''),
      country: String(form.get('country') || ''),
      is_default: Number(form.get('is_default') || 0),
    };
    if (editing?.id) {
      await userAPI.updateAddress(editing.id, payload);
    } else {
      await userAPI.addAddress({
        user_id: 0, // server infers from token; keep 0 placeholder
        address_line_1: payload.address_line_1,
        address_line_2: payload.address_line_2,
        city: payload.city,
        zip_code: payload.zip_code,
        state_id: undefined,
        country_id: undefined,
        is_default: payload.is_default || 0,
      });
    }
    setOpen(false);
    setEditing(null);
    await load();
  };

  const onDelete = async (id?: number) => {
    if (!id) return;
    await userAPI.deleteAddress(id);
    await load();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-foreground">My Addresses</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditing(null); setOpen(true); }}>
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Address' : 'Add Address'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSave} className="space-y-3">
              <div>
                <Label>Address Line 1</Label>
                <Input name="address_line_1" defaultValue={editing?.address_line_1} required />
              </div>
              <div>
                <Label>Address Line 2</Label>
                <Input name="address_line_2" defaultValue={editing?.address_line_2} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>City</Label>
                  <Input name="city" defaultValue={editing?.city} required />
                </div>
                <div>
                  <Label>State</Label>
                  <Input name="state" defaultValue={editing?.state} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>ZIP Code</Label>
                  <Input name="zip_code" defaultValue={editing?.zip_code} required />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input name="country" defaultValue={editing?.country} />
                </div>
              </div>
              <div>
                <Label>Default</Label>
                <select name="is_default" defaultValue={String(editing?.is_default || 0)} className="border rounded p-2 w-full">
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr: any) => (
            <Card key={addr.id} className="p-4 border border-border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{addr.address_line_1}</p>
                  {addr.address_line_2 && <p className="text-sm text-muted-foreground">{addr.address_line_2}</p>}
                  <p className="text-sm text-muted-foreground">{addr.city} {addr.zip_code}</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => { setEditing(addr); setOpen(true); }}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(addr.id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;


