window.events = (() => {
    const handle_model_updates = (event) => {
        if (event.model.messages) {
            const message = event.model.messages[0];
            if (message.local_id) {
                window.transmit.ack_local(message);
            }
        }
        try {
            model(event.model);
            _.redraw();
        } catch (e) {
            console.error('Error updating model:', event, e);
        }
    };

    const init = () => {
        console.log('init events');

        if (!window.ws) {
            console.warn('No web socket!');
            return;
        }

        window.ws.onmessage = (message) => {
            const event = JSON.parse(message.data);
            console.log('got message', event);
            if (event.type === 'update') {
                handle_model_updates(event);
            } else if (event.type === 'game') {
                window.games.handle_event(event);
            }
        };
    };
    return init;
})();
