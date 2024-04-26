import { Button } from "@/components/ui/button";
import { useTitle } from "@/hooks/useTitle";
import { useEffect, useState } from "react";
import FormInput from "@/components/FormInput";
import { useGetUsersQuery } from "../api/usersApiSlice";
import UserCard from "./UserCard";

export default function UsersList() {
  useTitle("Utenti | Courseopia");

  const { users, isLoading, isError } = useGetUsersQuery("usersList", {
    pollingInterval: 300000, // 5 minuti
    selectFromResult: ({ data, isLoading, isError }) => ({
      users: data,
      isLoading,
      isError,
    }),
  });

  const [selectedCategory, setSelectedCategory] = useState("Tutti");
  const [usersCategories, setUsersCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

useEffect(() => {
  const filterUsers = () => {
    let filtered = users;
    if (selectedCategory !== "Tutti") {
      filtered = filtered.filter(
        (user) => user.currentMaster?.title === selectedCategory
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
  };

  if (users) {
    filterUsers();
  }
}, [users, selectedCategory, searchTerm]);

useEffect(() => {
  if (users) {
    const uniqueCategories = [ ...new Set(users
      .filter((user) => user.currentMaster?.title !== undefined)
      .map((user) => user.currentMaster.title))]

    setUsersCategories(uniqueCategories);
  }
}, [users]);

  return (
    <>
      <div>
        <h2 className="text-3xl font-bold mb-12">Utenti</h2>
        <div className="flex gap-2 mb-8 justify-center items-center overflow-x-auto py-2">
          <Button
            variant={`${selectedCategory === "Tutti" ? "outline" : "default"}`}
            onClick={() => setSelectedCategory("Tutti")}
          >
            Tutti
          </Button>
          {usersCategories?.map((category, index) => (
            <Button
              key={index}
              variant={`${
                selectedCategory === category ? "outline" : "default"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <div>
          <FormInput
            label="Cerca un utente"
            type="text"
            value={searchTerm}
            placeholder="Cerca un utente"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 mt-8">
          {isLoading ? (
            <p>Loading...</p>
          ) : filteredUsers?.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                showAdvancedSettings={true}
              />
            ))
          ) : (
            <p>Non ci sono utenti corrispondenti alla ricerca.</p>
          )}
          {isError && <div>Errore durante il caricamento degli utenti.</div>}
        </div>
      </div>
    </>
  );
}
