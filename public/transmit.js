window.transmit = (() => {
    let local_id_seq = 100;
    let in_flight = [];

    function in_flight_messages(user_id) {
        return in_flight.filter((msg) => {
            return msg.user_id === user_id;
        });
    }

    function ack_local(ack_message) {
        const local_id = ack_message.local_id.toString();

        in_flight = in_flight.filter((msg) => {
            return msg.local_id.toString() !== local_id;
        });
    }

    function send_pm(user_id, content) {
        local_id_seq += 1;
        const local_id = local_id_seq + 0.01;
        const queue_id = window.model().state.queue_id;

        const message = {
            local_id: local_id,
            user_id: user_id,
            sender_full_name: window._.me.full_name,
            content: `<b>in flight<b><pre>${content}</pre>`,
        };

        if (queue_id) {
            in_flight.push(message);
            window._.redraw();
        } else {
            // We will send our message, but we won't locally echo it.
            console.warn('local echo is turned off until we know our queue_id');
        }

        const data = {
            type: 'private',
            to: JSON.stringify([user_id]),
            content: content,
            queue_id: queue_id,
            local_id: local_id,
        };
        console.info('data', data);

        fetch('/z/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    return {
        in_flight_messages: in_flight_messages,
        ack_local: ack_local,
        send_pm: send_pm,
    };
})();
