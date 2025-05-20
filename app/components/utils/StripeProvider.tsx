/**import React, { ReactElement } from 'react';
import Constants from 'expo-constants';
import { StripeProvider } from '@stripe/stripe-react-native';
import type { StripeProviderProps } from '@stripe/stripe-react-native';

//
// 1) On récupère la shape des props du provider natif
//
type BaseProps = Omit<StripeProviderProps, 'publishableKey'>;

//
// 2) On demande explicitement que children soit un ou plusieurs ReactElement
//
interface Props extends BaseProps {
    children: ReactElement | ReactElement[];
}

export default function OurStripeProvider({
    children,
    ...props
}: Props): ReactElement {
    // 3) Lecture de la clé depuis ton app.config.js
    const extra = (Constants.expoConfig?.extra ?? {}) as {
        STRIPE_PUBLISHABLE_KEY?: string;
    };
    const publishableKey = extra.STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
        console.warn(
            '[OurStripeProvider] publishableKey manquante dans expoConfig.extra',
        );
        // On sait que children est un ReactElement, donc on peut juste le renvoyer
        return Array.isArray(children) ? <>{children}</> : children;
    }

    // 4) On wrappe enfin dans le vrai provider natif
    return (
        <StripeProvider publishableKey={publishableKey} {...props}>
            {children}
        </StripeProvider>
    );
}*/