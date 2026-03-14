import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/auth-context';

export const useVerifyUser = () => {
    const { user, signOut } = useAuth();

    useEffect(() => {
        const verifyUserExists = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('id', user.id)
                    .single();

                if (error || !data) {
                    await signOut();
                }
            } catch (error) {
                console.error('Error verifying user:', error);
            }
        };

        verifyUserExists();
    }, [user?.id]); 
};