/* eslint-disable no-undef */
import React, {
    useState, useEffect,
} from 'react';
import { setLogLevel, AzureLogger } from '@azure/logger';
import {
    ChatComposite,
    createAzureCommunicationChatAdapter,
    FluentThemeProvider,
    fromFlatCommunicationIdentifier,
} from '@azure/communication-react';
import {
    AzureCommunicationTokenCredential,
} from '@azure/communication-common';
import { ChatClient } from '@azure/communication-chat';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import {
    registerIcons,
} from '@fluentui/react';
import {
    PeopleAddIcon,
    PeopleBlockIcon,
    ErrorBadgeIcon,
    ClearIcon,
} from '@fluentui/react-icons-mdl2';

registerIcons({
    icons: {
        peopleadd: <PeopleAddIcon aria-label="Adicionar Pessoa" />,
        peopleblock: <PeopleBlockIcon aria-label="Pessoa Removida" />,
        errorbadge: <ErrorBadgeIcon aria-label="Erro" />,
        clear: <ClearIcon aria-label="Limpar" />
    },
});
const connectionString = '<ACS_CONNECTION_STRING>';
let credentialModerador;

const App = () => {
    const [page, setPage] = useState('');
    const [adapter, setAdapter] = useState();

    setLogLevel('verbose');
    AzureLogger.log = (...args) => {
        console.log(...args); // to console, file, buffer, REST API..
    };

    const getACSEndpoint = () => {
        return connectionString.split(';accesskey=')[0].replace('endpoint=', '');
    }

    const FinalizarPagina = async () => {
        if (adapter) {
            await adapter.removeParticipant(localParticipant.userId);
        }
    };

    const refreshToken = async (userId) => {
        const identityClient = new CommunicationIdentityClient(connectionString);
        const userIdentifies = {
            communicationUserId: userId
        };

        const tokenModerator = await identityClient.getToken(userIdentifies, ['chat', 'voip']);

        return tokenModerator.token;
    };

    const createChatThread = async () => {
        const identityClient = new CommunicationIdentityClient(connectionString);
        const userModarator = await identityClient.createUser();
        const tokenModerator = await identityClient.createUserAndToken(['chat', 'voip']);
        const userAccessToken = tokenModerator.token;
        const userIdModerator = userModarator.communicationUserId;

        // token refresher it's not optional
        credentialModerador = new AzureCommunicationTokenCredential({
            tokenRefresher: async () => refreshToken(userIdModerator),
            refreshProactively: true,
            userAccessToken,
        });

        const chatClientModerator = new ChatClient(getACSEndpoint(), credentialModerador);

        const createChatThreadRequest = {
            topic: 'Chat',
        };
        const createChatThreadOptions = {
            participants: [
                {
                    id: { communicationUserId: userIdModerator },
                },
            ],
        };

        const createChatThreadResult = await chatClientModerator.createChatThread(
            createChatThreadRequest,
            createChatThreadOptions,
        );

        return createChatThreadResult.chatThread.id;
    };

    const joinThread = async (threadId, userId, displayName) => {
        const chatClient = new ChatClient(getACSEndpoint(), credentialModerador);
        const chatThreadClient = await chatClient.getChatThreadClient(threadId);
        await chatThreadClient.addParticipants({
            participants: [
                {
                    id: { communicationUserId: userId },
                    displayName,
                },
            ],
        });
    };

    useEffect(() => {
        (async () => {

            // Start a chat thread
            createChatThread().then(async (threadId) => {

                const identityClient = new CommunicationIdentityClient(connectionString);
                const usuarioParticipant = await identityClient.createUser();
                const tokenParticipant = await identityClient.createUserAndToken(['chat', 'voip']);
                const userAccessToken = tokenParticipant.token;
                const userId = usuarioParticipant.communicationUserId;
                // token refresher it's not optional
                const tokenParticipantCredential = new AzureCommunicationTokenCredential({
                    tokenRefresher: async () => refreshToken(userId),
                    refreshProactively: true,
                    userAccessToken,
                });
                const displayName = 'Marcos Sabino';
                await joinThread(threadId, userId, displayName);

                const adapterTemp = await createAzureCommunicationChatAdapter({
                    endpoint: getACSEndpoint(),
                    userId: fromFlatCommunicationIdentifier(userId),
                    displayName,
                    credential: tokenParticipantCredential,
                    threadId,
                });
                setAdapter(adapterTemp);
                setPage('chat');
            });
        })();

        return async () => {
            await FinalizarPagina();
        };
    }, []);

    return (
        <FluentThemeProvider>
            {page === 'chat' && adapter
                && (
                    <ChatComposite
                        adapter={adapter}
                        options={{ topic: false }}
                    />
                )}
            {page === ''
                && (
                    <React.Fragment>Initializing...</React.Fragment>)}
        </FluentThemeProvider>
    );
}

export default App;
