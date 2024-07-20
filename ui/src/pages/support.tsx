import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { MessageBox } from "react-chat-elements";
import { useUserStore } from "../store/user";
import { useEffect, useMemo, useState } from "react";
import { db } from "../lib/firebase";
import "react-chat-elements/dist/main.css";
import { useMutation } from "@tanstack/react-query";
import { ax } from "../lib/client";
import { lambdas } from "../lib/constants";

type MessagePayload = {
  id: string;
  messages: Array<{
    message: string;
    datetime: string;
  }>;
  userId: string;
  agentId: string;
};

export const Support = () => {
  const { user } = useUserStore();

  if (user?.role === "admin") {
    return <Agent />;
  }

  return <Customer />;
};

const Agent = () => {
  const [messages, setMessages] = useState<Array<MessagePayload>>([]);

  const { user } = useUserStore();

  const agentId = user?.username;

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("agentId", "==", agentId)
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const messagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData as MessagePayload[]);
      },
      (error) => {
        console.error("Error fetching messages: ", error);
      }
    );

    return () => unsubscribe();
  }, [agentId]);

  const customers = useMemo(
    () => messages?.map((m) => m.userId) || [],
    [messages]
  );

  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);

  useEffect(() => {
    if (!selectedCustomer) {
      setSelectedCustomer(customers[0]);
    }
  }, [customers, selectedCustomer]);

  const actualMessages =
    messages?.find((m) => m.userId === selectedCustomer)?.messages || [];

  return (
    <>
      <h1 className="text-2xl font-semibold mr-5 flex items-center gap-2 cursor-pointer hover:text-indigo-500">
        💬 Support
      </h1>

      <section className="mt-10">
        <div className="flex items-center gap-5">
          <label>Customers: </label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            {customers.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="shadow-lg p-10 mt-10">
          {actualMessages.map((m, idx) => (
            <MessageBox
              date={new Date(m.datetime)}
              focus
              id={idx}
              forwarded={false}
              status="read"
              notch={false}
              removeButton={false}
              replyButton={false}
              retracted={false}
              titleColor="black"
              key={idx}
              position={idx % 2 === 0 ? "left" : "right"}
              type="text"
              title={idx % 2 === 0 ? selectedCustomer : user?.username || ""}
              text={m.message}
            />
          ))}
          <div className="mt-5 flex items-center gap-2">
            <input
              id="message"
              className="w-full"
              placeholder={
                actualMessages?.length % 2 === 0
                  ? "Wait for response..."
                  : "You can resolve it by..."
              }
              disabled={actualMessages?.length % 2 === 0}
            />
            <button
              className="primary"
              disabled={actualMessages?.length % 2 === 0}
              onClick={async () => {
                const message = document.querySelector(
                  "#message"
                ) as HTMLInputElement;

                const messageDocRef = doc(db, "messages", selectedCustomer);

                await updateDoc(messageDocRef, {
                  messages: arrayUnion({
                    message: message.value,
                    datetime: new Date().toISOString(),
                  }),
                  agentId: user?.username,
                  userId: selectedCustomer,
                });

                message.value = "";
              }}
            >
              Respond
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

const Customer = () => {
  const [messages, setMessages] = useState<Array<MessagePayload>>([]);

  const { user } = useUserStore();

  const raiseConcernMutation = useMutation({
    mutationFn: () => ax.post(lambdas.raiseConcern, { userId: user?.username }),
  });

  const userId = user?.username;

  useEffect(() => {
    if (!userId) {
      return;
    }
    const q = query(collection(db, "messages"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const messagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData as MessagePayload[]);
      },
      (error) => {
        console.error("Error fetching messages: ", error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const singleAgentMessage = messages[0];

  const actualMessages = singleAgentMessage?.messages || [];

  return (
    <>
      <h1 className="text-2xl font-semibold mr-5 flex items-center gap-2 cursor-pointer hover:text-indigo-500">
        💬 Support
      </h1>

      <section className="mt-10">
        {!singleAgentMessage && (
          <>
            <h2 className="text-xl font-semibold text-center">
              Raise a concern
            </h2>
            <button
              className="primary w-full mt-5"
              onClick={() =>
                raiseConcernMutation.mutate(undefined, {
                  onSuccess: () => window.location.reload(),
                })
              }
            >
              Raise
            </button>
          </>
        )}
        {!!singleAgentMessage && (
          <div className="shadow-lg p-10 mt-10">
            {actualMessages.map((m, idx) => (
              <MessageBox
                date={new Date(m.datetime)}
                focus
                id={idx}
                forwarded={false}
                status="read"
                notch={false}
                removeButton={false}
                replyButton={false}
                retracted={false}
                titleColor="black"
                key={idx}
                position={idx % 2 === 0 ? "right" : "left"}
                type="text"
                title={
                  idx % 2 === 0
                    ? user?.username || ""
                    : singleAgentMessage?.agentId
                }
                text={m.message}
              />
            ))}

            <div className="mt-5 flex items-center gap-2">
              <input
                id="message"
                className="w-full"
                placeholder={
                  actualMessages?.length % 2 !== 0
                    ? "Wait for response..."
                    : "Respond..."
                }
                disabled={actualMessages?.length % 2 !== 0}
              />
              <button
                className="primary"
                disabled={actualMessages?.length % 2 !== 0}
                onClick={async () => {
                  const message = document.querySelector(
                    "#message"
                  ) as HTMLInputElement;

                  const messageDocRef = doc(db, "messages", userId || "");

                  await updateDoc(messageDocRef, {
                    messages: arrayUnion({
                      message: message.value,
                      datetime: new Date().toISOString(),
                    }),
                    agentId: singleAgentMessage?.agentId,
                    userId,
                  });

                  message.value = "";
                }}
              >
                Respond
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
};
