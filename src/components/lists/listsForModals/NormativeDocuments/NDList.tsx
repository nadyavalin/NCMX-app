import React from "react";

export const NormativeDocumentsList = () => {
  return (
    <>
      <option value="">...выберите ISO/НД</option>
      <option value="ISO 9001">ISO 9001</option>
      <option value="ISO 80079-34">ISO 80079-34</option>
      <option value="A1">A1</option>
      <option value="A2">A2</option>
      <option value="A3">A3</option>
      <option value="A4">A4</option>
      <option value="A5.1">A5.1</option>
      <option value="A5.2">A5.2</option>
      <option value="A6.1">A6.1</option>
      <option value="A6.2">A6.2</option>
      <option value="A7">A7</option>
      <option value="A8.4">A8.4</option>
      <option value="A8.5">A8.5</option>
      <option value="A8.6">A8.6</option>
      <option value="A9">A9</option>
      <option value="A10">A10</option>
      <option value="A11">A11</option>
      <option value="A12">A12</option>
      <option value="A14">A14</option>
    </>
  );
};

export default React.memo(NormativeDocumentsList);
