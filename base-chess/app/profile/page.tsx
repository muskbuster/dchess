"use client";
import PrivyWrapper from "@/components/Common/PrivyWrapper";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:42069",
  cache: new InMemoryCache(),
});

const ProfilePage = () => {
  return (
    <ApolloProvider client={client}>
      <section className="w-full">
        <PrivyWrapper page="Profile" />
      </section>
    </ApolloProvider>
  );
};

export default ProfilePage;
