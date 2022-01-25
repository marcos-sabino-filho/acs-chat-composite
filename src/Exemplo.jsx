import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import React from 'react';
import {
    registerIcons,
} from '@fluentui/react';
import {
    PeopleAddIcon,
    PeopleBlockIcon,
    ErrorBadgeIcon,
    ClearIcon,
    EditIcon,
    RemoveFilterIcon,
    ReceiptCheckIcon,
    CheckMarkIcon,
} from '@fluentui/react-icons-mdl2';
// https://uifabricicons.azurewebsites.net/ para mais icones

registerIcons({
    icons: {
        peopleadd: <PeopleAddIcon aria-label="Adicionar Pessoa" />,
        peopleblock: <PeopleBlockIcon aria-label="Pessoa Removida" />,
        errorbadge: <ErrorBadgeIcon aria-label="Erro" />,
        clear: <ClearIcon aria-label="Limpar" />,
        messageedit: <EditIcon aria-label="Editar" />,
        messageremove: <RemoveFilterIcon aria-label="Remover" />,
        messageseen: <ReceiptCheckIcon aria-label="Visualizado" />,
        messagedelivered: <CheckMarkIcon aria-label="Enviado" />,
    },
});

const GetHistoryChatMessages = () => {
    return [
        {
            messageType: 'chat',
            senderId: 'user1',
            senderDisplayName: 'Kat Larsson',
            messageId: Math.random().toString(),
            content: 'Hi everyone, I created this awesome group chat for us!',
            createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
            mine: true,
            attached: false,
            status: 'seen',
            contentType: 'text'
        },
        {
            messageType: 'chat',
            senderId: 'user2',
            senderDisplayName: 'Robert Tolbert',
            messageId: Math.random().toString(),
            content: 'Nice! This looks great!',
            createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
            mine: false,
            attached: false,
            contentType: 'text'
        },
        {
            messageType: 'chat',
            senderId: 'user3',
            senderDisplayName: 'Carole Poland',
            messageId: Math.random().toString(),
            content: "Yeah agree, let's chat here from now on!",
            createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
            mine: false,
            attached: false,
            contentType: 'text'
        },{
            messageType: 'chat',
            senderId: 'user1',
            senderDisplayName: 'Kat Larsson',
            messageId: Math.random().toString(),
            content: 'Hi everyone, I created this awesome group chat for us!',
            createdOn: new Date('2019-04-13T00:00:00.000+08:08'),
            mine: true,
            attached: false,
            status: 'delivered',
            contentType: 'text'
        }
    ];
};

const GetHistoryWithSystemMessages = () => {
    return [
        ...GetHistoryChatMessages(),
        {
            messageType: 'system',
            createdOn: new Date('2020-04-13T00:00:00.000+07:01'),
            systemMessageType: 'content',
            messageId: Math.random().toString(),
            iconName: 'PeopleAdd',
            content: 'Miguel Garcia is added to the chat'
        }
    ];
};

export const Exemplo = () => {
    return (
        <FluentThemeProvider>
            <MessageThread
                userId={'1'}
                messages={GetHistoryWithSystemMessages()}
                showMessageDate={true}
                showMessageStatus={true}
            />
        </FluentThemeProvider>
    );
};
