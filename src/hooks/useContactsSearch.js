import { useMemo } from "react";
import { useForm } from "react-hook-form";
import useAddressLabels from "./useAddressLabels";

// search for contacts using address or label
export default function useContactsSearch(data) {
  const { labels } = useAddressLabels();
  const { register, watch } = useForm({
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const query = watch("query");

  const searched = useMemo(() => {
    if (!query) return data;

    if (!Array.isArray(data)) return data;

    const lowerCaseQuery = query.toLowerCase();

    const matchingLabelsAddresses = Object.keys(labels)
      .map((key) =>
        labels[key].toLowerCase().includes(lowerCaseQuery) ? key : false
      )
      .filter(Boolean);

    return data.filter((item) => {
      const address = item.address.toString().toLowerCase();
      const ens = item.ens && item.ens.toString().toLowerCase();

      return (
        address.includes(lowerCaseQuery) ||
        matchingLabelsAddresses.includes(address) ||
        ens?.includes(lowerCaseQuery)
      );
    });
  }, [data, query, labels]);

  return { data: searched, register };
}
